export type RedisKeyType = 'PASSWORD_CHANGE' | 'NICKNAME_CHANGE'

export type RedisKey = `${RedisKeyType}:${string}`
