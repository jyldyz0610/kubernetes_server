// frontend/src/utils/fetchMetaTags.js

import axios from 'axios';
import cheerio from 'cheerio';

const fetchMetaTags = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const metaTags = [];

        $('meta').each((i, element) => {
            const name = $(element).attr('name') || $(element).attr('property');
            const content = $(element).attr('content');
            if (name && content) {
                metaTags.push({ name, content });
            }
        });

        return metaTags;
    } catch (error) {
        return { error: error.message };
    }
};

export default fetchMetaTags;
