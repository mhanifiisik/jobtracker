export const APPLICATION_STATUSES = {
  APPLIED: 'applied',
  PHONE_SCREENING: 'phone_screening',
  TECHNICAL_INTERVIEW: 'technical_interview',
  ONSITE_INTERVIEW: 'onsite_interview',
  TAKE_HOME_ASSESSMENT: 'take_home_assessment',
  OFFER_RECEIVED: 'offer_received',
  OFFER_ACCEPTED: 'offer_accepted',
  OFFER_DECLINED: 'offer_declined',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[keyof typeof APPLICATION_STATUSES];
