import API from './api';

export const getCompanyById = async (companyId) => {
    try {
        const response = await API.get(`companies/${companyId}`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching company data:', error);
        throw error;
    }
};