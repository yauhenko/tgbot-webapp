export type User = {
  id: number;
  firstName?: string;
  username?: string;
  photoUrl?: string;
  extra: Settings;
};

export type Bot = {
  paymentUrl: string;
};

export type UserBot = {
  id: number;
  user: User;
  bot: Bot;
  isPaid: boolean;
  isPlus: boolean;
  paidTill: string | null;
  extra: Settings;
};

export type Category = {
  id: string;
  isParent: boolean;
  name: string;
  icon: string | null;
  description: string | null;
};

export type Settings = {
  lang: string | null;
  character: string | null;
};

export type RefStats = {
  total: number;
  plus: number;
};
