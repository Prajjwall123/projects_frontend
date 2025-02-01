import API from './api';

export const getFreelancerById = async (freelancerId) => {
    try {
        const response = await API.get(`freelancers/${freelancerId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching freelancer data:', error);
        throw error;
    }
};