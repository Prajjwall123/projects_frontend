import API from './api';

export const getFreelancerById = async (freelancerId) => {
    try {
        console.log("called for freelancer");
        const response = await API.get(`freelancers/${freelancerId}`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching freelancer data:', error);
        throw error;
    }
};