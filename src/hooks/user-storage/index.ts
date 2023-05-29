import { setCookie } from "@/libs/cookie";
import { User } from "@/types";
import { storageConstants } from "@/types";

export function setStoredUser(user: User): void {
  localStorage.setItem(storageConstants.user, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(storageConstants.user);
}

/**
 * accessToken을 localStorage에 저장
 * @param accessToken
 *
 */
export function setAccessToken(accessToken: string): void {
  localStorage.setItem(storageConstants.accessToken, accessToken);
}

/**
 * refreshToken을 cookie 저장
 * @param refreshToken
 */
export function setRefreshToken(refreshToken: string): void {
  setCookie(storageConstants.refreshToken, refreshToken, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    // httpOnly: true,
    //httpOnly 옵션은 ie 브라우져를 쓰거나 .com 등으로 끝나는 일반적인 도메인에만 적용가능
    // secure: true,
    // sameSite: "none",
  });
}
