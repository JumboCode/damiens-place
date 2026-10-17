/** globals.d.ts
 * This file contains information about the "admin" user role
 * 
 * Created on 15 Oct 2026
 * 
 * By William Balz and Nirvaan Govind
 */

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
        role?: "admin"
    };
  }
}