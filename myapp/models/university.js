module.exports = {
    getUniversityApi: async (page, perPage) => {
       let url =
            'https://api.odcloud.kr/api/15014632/v1/' +
            `uddi:2a558a3b-9b5f-465f-99e6-d9910cdeadc6?page=${page}&perPage=${perPage}&` +
            'serviceKey=Oton733M%2BFI2L2RQaUqhhbZCKiaxqx%2FfQYOUKRWvTRgs0KyVxJQ22jk5xdkvQmE57WN5LsGcrOzbHSZ8jaDXkQ%3D%3D';
        const response = await fetch(url); const response_j = await response.json();

        return response_j;
    }
}
