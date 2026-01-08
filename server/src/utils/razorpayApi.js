import fetch from 'node-fetch';

/**
 * Direct Razorpay REST API wrapper for endpoints not supported by the SDK
 * Uses HTTP Basic Auth with key_id:key_secret
 */

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1';

/**
 * Create a Razorpay Offer for Subscriptions
 * @param {Object} offerData - Offer configuration
 * @returns {Promise<Object>} Created offer with ID
 */
export const createRazorpayOffer = async (offerData) => {
    const auth = Buffer.from(
        `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString('base64');

    const response = await fetch(`${RAZORPAY_API_BASE}/offers`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerData)
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('[Razorpay API] Error Response:', {
            status: response.status,
            statusText: response.statusText,
            error: error
        });
        throw new Error(error.error?.description || error.error?.code || 'Failed to create Razorpay offer');
    }

    return await response.json();
};

/**
 * Fetch an existing Razorpay Offer by ID
 * @param {string} offerId - Offer ID (e.g., offer_ABC123)
 * @returns {Promise<Object>} Offer details
 */
export const getRazorpayOffer = async (offerId) => {
    const auth = Buffer.from(
        `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
    ).toString('base64');

    const response = await fetch(`${RAZORPAY_API_BASE}/offers/${offerId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.description || 'Failed to fetch Razorpay offer');
    }

    return await response.json();
};
