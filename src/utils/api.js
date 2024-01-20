// /src/utils/api.js

const API_BASE_URL = 'https://ws-public.interpol.int/notices/v1/red';

export const fetchData = async (currentPage) => {
    try {
        const response = await fetch(`${API_BASE_URL}?page=${currentPage}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const json = await response.json();

        if (json._embedded && Array.isArray(json._embedded.notices)) {
            const notices = json._embedded.notices.slice(0, 9);
            const processedData = await Promise.all(
                notices.map(async (notice) => {
                    const imagesResponse = await fetch(notice._links.images.href);
                    const imagesJson = await imagesResponse.json();

                    return {
                        entity_id: notice.entity_id,
                        noticeId: convertEntityIdToNoticeId(notice.entity_id),
                        forename: notice.forename || 'N/A',
                        name: notice.name || 'N/A',
                        images: imagesJson._links.thumbnail.href,
                    };
                })
            );

            return processedData;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const convertEntityIdToNoticeId = (entityId) => {
    return entityId.replace('/', '-');
};
