interface WidgetProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}

const Widget = ({ title, icon, content, footer }: WidgetProps) => {
  return (
    <div className="bg-background rounded-2xl border p-4">
      <div className="flex items-center">
        <span className="relative rounded-xl bg-purple-200 p-4">{icon}</span>
        <p className="text-md ml-2 text-black">{title}</p>
      </div>
      <div className="flex flex-col justify-start">
        <p className="my-4 text-left text-4xl font-bold text-gray-700">{content}</p>
        <div className="flex items-center text-sm text-green-500">{footer}</div>
      </div>
    </div>
  );
};

export default Widget;
