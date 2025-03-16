import React, { useState } from 'react';

function Feedback() {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Feedback submitted:', feedback);
        setFeedback('');
    };

    return (
        <div className="max-w-full mx-auto p-4 mt-20 rounded-lg shadow-md border border-green-200 bg-white/10 backdrop-blur-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-white">Feedback Form</h2>
            <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows="1"
                    className=" h-16 flex-grow p-2 border border-green-400 rounded-lg focus:outline-none focus:border-green-600 bg-white/30 backdrop-blur-md text-white placeholder-white"
                    placeholder="If the app doesn't recognize any particular object, please notify us about it..."
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 backdrop-blur-md"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Feedback;
