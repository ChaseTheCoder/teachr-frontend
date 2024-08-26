'use server'

import { getProfile } from "../../services/authenticatedApiCalls";

export async function getUserProfile() {
  let profile = null;
  console.log('getUserProfile');
  try {
    profile = await getProfile();
    return profile;
  } catch (error) {
    console.error(error);
  }
}