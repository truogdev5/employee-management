export const enum UserStatus {
   ACTIVE = 'active',
   DEACTIVE = 'deactive',
}

export const enum UserRole {
   ADMIN = 1,
   USER = 0,
}

export enum StatusCode {
   NOT_FOUND = 404,
   BAD_REQUEST = 400,
   SUCCESS = 200,
   INTERNAL_SERVER_ERROR = 500,
   UNAUTHORIZED = 401,
   FORBIDDEN = 403,
   PRECONDITION_REQUIRED = 428,
}

export enum BooleanEnum {
   TRUE = 1,
   FALSE = 0,
}
