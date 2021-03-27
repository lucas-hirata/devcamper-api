import NodeGeocoder from 'node-geocoder';

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdaptr: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null,
};

export default NodeGeocoder(options);
