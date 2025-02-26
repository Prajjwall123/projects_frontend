import API from "./api";

export const fetchNotifications = async (userId, userType) => {
    try {
        const response = await API.get(`/notifications/${userId}/${userType}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

export const markNotificationAsRead = async (notificationId) => {
    try {
        await API.put(`/notifications/mark-read/${notificationId}`);
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

export const fetchUnreadNotificationsCount = async (userId, userType) => {
    try {
        const response = await API.get(`/notifications/${userId}/${userType}`);
        const unreadCount = response.data.filter(notification => !notification.isRead).length;
        return unreadCount;
    } catch (error) {
        console.error("Error fetching unread notifications count:", error);
        return 0;
    }
};
