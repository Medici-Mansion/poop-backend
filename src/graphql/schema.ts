
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class User {
    id: number;
}

export abstract class IQuery {
    abstract getUser(): User | Promise<User>;
}

type Nullable<T> = T | null;
