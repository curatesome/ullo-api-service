export type OAuthProviderType = 'none' | 'kakao' | 'google' | 'apple';

export interface UserFromOAuthProvider {
  provider: OAuthProviderType
  id: string
}

export interface User {
  _id: string;
  email: string;
  password: string;
  profileImage: string;
  informationFromProvider: UserFromOAuthProvider;
  createdAt: Date;
  updatedAt: Date;
}
