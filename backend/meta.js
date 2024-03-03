const axios = require('axios');
const cheerio = require('cheerio');

async function fetchMetaTags(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const metaTags = {};

        $('meta').each((i, element) => {
            const name = $(element).attr('name') || $(element).attr('property');
            if (name) {
                metaTags[name] = $(element).attr('content');
            }
        });

        return metaTags;
    } catch (error) {
        return { error: error.message };
    }
}

// Example usage
fetchMetaTags('https://www.google.ca').then(metaTags => console.log(metaTags));