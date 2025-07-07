import axios from 'axios';

export const upload = (token, file) => { // separate from reducer function to import movies using axious and input of file type
    const formData = new FormData();
    formData.append('movies', file); 

    return axios.post(`${process.env.REACT_APP_API_URL}/movies/import`, formData, {
        headers: {
            Authorization: token,
        },
    });
};
