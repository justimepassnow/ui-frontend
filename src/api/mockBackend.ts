/**
 * Mock Backend API
 * These functions simulate network calls to the n8n backend.
 * They use setTimeout to mimic real-world latency.
 */

export interface MockApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Simulates generating a certificate preview.
 * @param formData The form data collected from the frontend.
 * @returns A promise that resolves to a mock preview image URL.
 */
export const generatePreview = async (formData: FormData): Promise<string> => {
  console.log('API call: generatePreview', Array.from(formData.entries()));
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Returning a placeholder image URL to simulate the generated certificate
      resolve('https://placehold.co/600x400/FDE68A/2B2D42?text=Certificate+Preview');
    }, 2500); // 2.5 second delay
  });
};

/**
 * Simulates the mass distribution of certificates.
 * @param formData The form data collected from the frontend.
 * @returns A promise that resolves when the simulated process is complete.
 */
export const massDistribute = async (formData: FormData): Promise<MockApiResponse> => {
  console.log('API call: massDistribute', Array.from(formData.entries()));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Certificates distributed successfully!'
      });
    }, 3000); // 3 second delay
  });
};
