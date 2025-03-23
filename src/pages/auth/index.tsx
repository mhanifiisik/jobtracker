import { useCallback, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router';
import supabase from '@/utils/supabase';
import toast from 'react-hot-toast';
import { handleError } from '@/utils/error-handler';
import { signInSchema, signUpSchema } from '@/schemas/user-schemas';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState<boolean>(true);
  const navigate = useNavigate();

  const signInFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: async values => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          handleError(error);
        } else {
          await navigate('/dashboard');
        }
      } catch (err) {
        handleError(err);
      }
    },
  });

  const signUpFormik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async values => {
      try {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              username: values.username,
            },
          },
        });

        if (error) {
          handleError(error);
        } else {
          toast.success('Signed up successfully! Please check your email for verification.');
          setIsSignIn(true);
        }
      } catch (err) {
        handleError(err);
      }
    },
  });

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      handleError(error);
    }
  }, []);

  const signInWithGithub = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      handleError(error);
    }
  }, []);

  const currentFormik = isSignIn ? signInFormik : signUpFormik;

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="relative flex w-full flex-col items-center justify-center rounded p-8 md:w-1/2">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="mb-4 text-center text-3xl font-bold text-gray-900">
            {isSignIn ? 'Sign in' : 'Sign up'}
          </h1>

          <p className="mb-6 text-center text-gray-500">
            {isSignIn ? 'Sign in with your account' : 'Create your account'}
          </p>

          <div className="mb-6 flex gap-4">
            <button
              type="button"
              onClick={() => {
                void (async () => {
                  await signInWithGoogle();
                })();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:cursor-pointer hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30">
                <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => {
                void (async () => {
                  await signInWithGithub();
                })();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:cursor-pointer hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 30 30">
                <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
              </svg>
              GitHub
            </button>
          </div>

          <div className="mb-6 flex items-center">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="mx-2 text-sm text-gray-400">or continue with email</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <form onSubmit={currentFormik.handleSubmit}>
            {!isSignIn && (
              <div className="mb-4">
                <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Your username"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  value={signUpFormik.values.username}
                  onChange={signUpFormik.handleChange}
                  onBlur={signUpFormik.handleBlur}
                />
                {signUpFormik.touched.username && signUpFormik.errors.username && (
                  <p className="mt-1 text-sm text-red-500">{signUpFormik.errors.username}</p>
                )}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={currentFormik.values.email}
                onChange={currentFormik.handleChange}
                onBlur={currentFormik.handleBlur}
              />
              {currentFormik.touched.email && currentFormik.errors.email && (
                <p className="mt-1 text-sm text-red-500">{currentFormik.errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={currentFormik.values.password}
                onChange={currentFormik.handleChange}
                onBlur={currentFormik.handleBlur}
              />
              {currentFormik.touched.password && currentFormik.errors.password && (
                <p className="mt-1 text-sm text-red-500">{currentFormik.errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-md border border-gray-300 px-4 py-3 font-medium hover:cursor-pointer hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {isSignIn ? 'SignIn' : 'SignUp'}
            </button>
          </form>

          <div className="relative mt-4 text-center text-sm text-gray-700">
            {isSignIn ? (
              <span>
                Don't have an account?{' '}
                <button type="button" onClick={toggleMode} className="hover:underline">
                  Sign up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button type="button" onClick={toggleMode} className="hover:underline">
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
