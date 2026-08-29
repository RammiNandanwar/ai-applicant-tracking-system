const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const analyzeResume = async (
    resumeText,
    jobDescription
) => {

    const prompt = `
You are an AI-powered Applicant Tracking System.

Analyze the candidate resume against the job description.

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

Analyze the candidate objectively.

Do not invent information that is not present in the resume.

Return the candidate analysis using the requested JSON structure.
`;

    try {

        console.log("Calling Gemini API...");

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",

            contents: prompt,

            config: {
                responseMimeType: "application/json",

                responseSchema: {
                    type: Type.OBJECT,

                    properties: {

                        matchScore: {
                            type: Type.NUMBER,
                            description:
                                "Candidate match score from 0 to 100"
                        },

                        skills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            },
                            description:
                                "Relevant skills found in the resume"
                        },

                        experience: {
                            type: Type.STRING,
                            description:
                                "Relevant experience found in the resume"
                        },

                        strengths: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            },
                            description:
                                "Candidate strengths relevant to the job"
                        },

                        missingSkills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            },
                            description:
                                "Important job skills missing or weak in the resume"
                        },

                        summary: {
                            type: Type.STRING,
                            description:
                                "Brief explanation of candidate suitability"
                        }

                    },

                    required: [
                        "matchScore",
                        "skills",
                        "experience",
                        "strengths",
                        "missingSkills",
                        "summary"
                    ]
                }
            }
        });

        console.log("Gemini response received.");

        if (!response.text) {
            throw new Error(
                "Gemini returned an empty response"
            );
        }

        const analysis = JSON.parse(
            response.text
        );

        // Make sure score stays between 0 and 100
        analysis.matchScore = Math.max(
            0,
            Math.min(
                100,
                Number(analysis.matchScore)
            )
        );

        return analysis;

    } catch (error) {

        console.error(
            "Gemini AI analysis error:"
        );

        console.error(error);

        throw new Error(
            `Gemini AI analysis failed: ${error.message}`
        );
    }
};

module.exports = analyzeResume;