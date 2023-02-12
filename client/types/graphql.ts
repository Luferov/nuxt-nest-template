export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Gender =
  | 'FEMALE'
  | 'MALE'
  | 'UNKNOWN';

export type Mutation = {
  __typename?: 'Mutation';
  login: UserLoginType;
  register?: Maybe<UserLoginType>;
};


export type MutationLoginArgs = {
  userLoginInput: UserLoginInput;
};


export type MutationRegisterArgs = {
  userRegisterInput: UserRegisterInput;
};

export type Query = {
  __typename?: 'Query';
  me: User;
};

export type Role =
  | 'ADMIN'
  | 'USER';

export type User = {
  __typename?: 'User';
  /** Флаг активности пользователя */
  active: Scalars['Boolean'];
  avatar?: Maybe<Scalars['String']>;
  /** День рожденья */
  birthday?: Maybe<Scalars['DateTime']>;
  /** Дата регистрации пользователя */
  createdAt: Scalars['DateTime'];
  /** Email пользователя */
  email: Scalars['String'];
  /** Имя */
  firstName: Scalars['String'];
  /** Пол пользователя */
  gender: Gender;
  /** Идентификатор пользователя */
  id: Scalars['ID'];
  /** Фамилия */
  lastName: Scalars['String'];
  /** Роль пользователя */
  role: Role;
  /** Отчество */
  sirName?: Maybe<Scalars['String']>;
  /** Дата обновления */
  updatedAt: Scalars['DateTime'];
  /** Логин пользователя */
  username: Scalars['String'];
};

export type UserAvgAggregate = {
  __typename?: 'UserAvgAggregate';
  id?: Maybe<Scalars['Float']>;
};

export type UserCountAggregate = {
  __typename?: 'UserCountAggregate';
  _all: Scalars['Int'];
  active: Scalars['Int'];
  avatar: Scalars['Int'];
  birthday: Scalars['Int'];
  createdAt: Scalars['Int'];
  email: Scalars['Int'];
  firstName: Scalars['Int'];
  gender: Scalars['Int'];
  id: Scalars['Int'];
  lastName: Scalars['Int'];
  role: Scalars['Int'];
  sirName: Scalars['Int'];
  updatedAt: Scalars['Int'];
  username: Scalars['Int'];
};

export type UserLoginInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserLoginType = {
  __typename?: 'UserLoginType';
  accessToken: Scalars['String'];
  user: User;
};

export type UserMaxAggregate = {
  __typename?: 'UserMaxAggregate';
  active?: Maybe<Scalars['Boolean']>;
  avatar?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['DateTime']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  id?: Maybe<Scalars['Int']>;
  lastName?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
  sirName?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  username?: Maybe<Scalars['String']>;
};

export type UserMinAggregate = {
  __typename?: 'UserMinAggregate';
  active?: Maybe<Scalars['Boolean']>;
  avatar?: Maybe<Scalars['String']>;
  birthday?: Maybe<Scalars['DateTime']>;
  createdAt?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  id?: Maybe<Scalars['Int']>;
  lastName?: Maybe<Scalars['String']>;
  role?: Maybe<Role>;
  sirName?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
  username?: Maybe<Scalars['String']>;
};

export type UserRegisterInput = {
  /** Date of birthday  */
  birthday?: InputMaybe<Scalars['DateTime']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  sirName?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type UserSumAggregate = {
  __typename?: 'UserSumAggregate';
  id?: Maybe<Scalars['Int']>;
};

export type UserFieldsFragment = { __typename: 'User', id: string, username: string, avatar?: string | null, email: string, lastName: string, firstName: string, sirName?: string | null, birthday?: any | null, role: Role, gender: Gender, active: boolean, createdAt: any, updatedAt: any };

export type LoginMutationVariables = Exact<{
  userLoginInput: UserLoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename: 'UserLoginType', accessToken: string, user: { __typename: 'User', id: string, username: string, avatar?: string | null, email: string, lastName: string, firstName: string, sirName?: string | null, birthday?: any | null, role: Role, gender: Gender, active: boolean, createdAt: any, updatedAt: any } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename: 'User', id: string, username: string, avatar?: string | null, email: string, lastName: string, firstName: string, sirName?: string | null, birthday?: any | null, role: Role, gender: Gender, active: boolean, createdAt: any, updatedAt: any } };
