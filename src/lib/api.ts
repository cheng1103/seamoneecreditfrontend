const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

type ApiErrorPayload = {
  message?: string;
  errors?: { field?: string; message?: string }[];
};

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      throw new Error('Invalid response format');
    }

    const data = await response.json();

    if (!response.ok) {
      const error: Error & { status?: number; data?: ApiErrorPayload } = new Error(
        data.message || 'Something went wrong'
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    // Re-throw if it's already an Error
    if (error instanceof Error) {
      throw error;
    }
    // Handle unexpected errors
    throw new Error('An unexpected error occurred');
  }
}

// Products
export const getProducts = () => fetchApi('/products');
export const getProduct = (slug: string) => fetchApi(`/products/${slug}`);
export const getFeaturedProducts = () => fetchApi('/products/featured');

// Blogs
export const getBlogs = (page = 1, limit = 10, category?: string) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (category) params.append('category', category);
  return fetchApi(`/blogs?${params}`);
};
export const getBlog = (slug: string) => fetchApi(`/blogs/${slug}`);
export const getRecentBlogs = () => fetchApi('/blogs/recent');

// FAQs
export const getFAQs = (category?: string) => {
  const params = category ? `?category=${category}` : '';
  return fetchApi(`/faqs${params}`);
};

// Testimonials
export const getTestimonials = (limit = 10, branchSlug?: string) => {
  const params = new URLSearchParams({ limit: String(limit) });
  if (branchSlug) params.append('branchSlug', branchSlug);
  return fetchApi(`/testimonials?${params.toString()}`);
};
export const getFeaturedTestimonials = (branchSlug?: string) => {
  const params = branchSlug ? `?branchSlug=${branchSlug}` : '';
  return fetchApi(`/testimonials/featured${params}`);
};

// Content
export const getSiteSettings = () => fetchApi('/content/settings');
export const getPageContent = (page: string) => fetchApi(`/content/page/${page}`);

// Applications
interface ApplicationResponse {
  applicationId: string;
  status: string;
}

export const submitApplication = (data: Record<string, unknown>) =>
  fetchApi<ApplicationResponse>('/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const checkApplicationStatus = (applicationId: string) =>
  fetchApi(`/applications/check/${applicationId}`);

// Contact
export const submitContactForm = (data: Record<string, unknown>) =>
  fetchApi('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
