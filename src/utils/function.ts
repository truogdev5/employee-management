export function generateRandomString(length: number = 8): string {
   return Array.from(
      { length },
      () =>
         'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[
            Math.floor(Math.random() * 62)
         ]
   ).join('');
}
