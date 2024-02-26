
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}

export class Users {
    id: string;
    updatedAt: DateTime;
    createdAt: DateTime;
    nickname: string;
    email: string;
    password: string;
    role: UserRole;
}

export abstract class IQuery {
    abstract getAllUsers(): Users[] | Promise<Users[]>;
}

export type DateTime = any;
type Nullable<T> = T | null;
