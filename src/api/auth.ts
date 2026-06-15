import axios from 'axios';
import { privateApi, publicApi } from './client';

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    if (
      Array.isArray(responseData?.errors) &&
      responseData.errors.length > 0
    ) {
      return responseData.errors
        .map((item: { message: string }) => item.message)
        .join(', ');
    }

    return responseData?.message || error.message || 'Something went wrong';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}

export async function loginUser(payload: any) {
  try {
    const response = await privateApi.post<any>('auth/login', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function signupUser(payload: any) {
  try {
    const response = await publicApi.post<any>('auth/register', payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getMe() {
  try {
    const response = await privateApi.get<any>('auth/me');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createCredentialAPI(payload: any) {
  try {
    const response = await privateApi.post<any>('credentials', payload);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAllCredentialsAPI(type:string,search:any) {
  const params:any ={type};
  if(search.trim()) params.search = search.trim();
  try {
    const response = await privateApi.get<any>('credentials', { params });
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAllCredentialsStaticAPI() {
  try {
    const response = await privateApi.get<any>('credentials/stats');
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getCredentialByIdAPI(id: any) {
  try {
    const response = await privateApi.get<any>(`credentials/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteCredentialByIdAPI(id: any) {
  try {
    const response = await privateApi.delete<any>(`credentials/${id}`);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateCredentialAPI(payload: any, id:any) {
  try {
    const response = await privateApi.put<any>(`credentials/${id}`, payload);
    return response;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}




