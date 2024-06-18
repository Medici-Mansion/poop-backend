import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { Gender } from "./enums";

export type Breed = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
    nameKR: string | null;
    nameEN: string | null;
    avatar: string | null;
};
export type Profile = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
    avatarUrl: string | null;
    name: string;
    birthday: Timestamp;
    gender: Generated<Gender>;
    breedId: string;
    userId: string;
};
export type SearchBreeds = {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
    nameKR: string;
    nameEN: string | null;
    avatar: string | null;
    searchKey: string;
    searchKeyCode: number | null;
};
export type User = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
    accountId: string;
    password: string;
    nickname: string;
    email: string | null;
    phone: string | null;
    birthday: Timestamp;
    gender: Generated<Gender>;
    verified: Timestamp | null;
    latestToken: string | null;
    latestProfileId: string | null;
};
export type verification = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    deletedAt: Timestamp | null;
    code: string;
    userId: string;
};
export type DB = {
    breeds: Breed;
    profiles: Profile;
    search_breeds: SearchBreeds;
    users: User;
    verification: verification;
};
