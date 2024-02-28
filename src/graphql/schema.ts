
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum provider {
    KAKAO = "KAKAO",
    APPLE = "APPLE",
    GOOGLE = "GOOGLE"
}

export class GetUserFromProviderInput {
    provider: provider;
}

export class Users {
    id: string;
    updatedAt: DateTime;
    createdAt: DateTime;
    name: string;
    email: string;
    accounts: Accounts[];
}

export class Accounts {
    id: string;
    updatedAt: DateTime;
    createdAt: DateTime;
    type: string;
    provider: provider;
    providerAccountId: string;
    refreshToken: string;
    userId: string;
    users: Users[];
}

export class GetUserFromProviderOutPut {
    provider: provider;
}

export abstract class IQuery {
    abstract getAllUsers(): Users[] | Promise<Users[]>;
}

export abstract class IMutation {
    abstract getUserFromServiceProvider(input: GetUserFromProviderInput): GetUserFromProviderOutPut | Promise<GetUserFromProviderOutPut>;
}

export type DateTime = any;
type Nullable<T> = T | null;
