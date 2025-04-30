import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const JobResumeUpload = ({ jobId }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setError(null);
        } else {
            setError('Please select a PDF file');
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${jobId}/upload-resume/`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload resume');
            }

            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Upload Resume for This Position
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <input
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        id="resume-upload"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="resume-upload">
                        <Button
                            variant="contained"
                            component="span"
                            startIcon={<CloudUploadIcon />}
                            disabled={loading}
                        >
                            Select Resume
                        </Button>
                    </label>

                    {file && (
                        <Typography variant="body2" color="textSecondary">
                            Selected file: {file.name}
                        </Typography>
                    )}

                    {file && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpload}
                            disabled={loading}
                        >
                            Upload and Process
                        </Button>
                    )}

                    {loading && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            <Typography>Processing resume...</Typography>
                        </Box>
                    )}

                    {error && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                            <ErrorIcon />
                            <Typography>{error}</Typography>
                        </Box>
                    )}

                    {result && (
                        <Box sx={{ mt: 2, width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CheckCircleIcon color="success" />
                                <Typography variant="h6">
                                    Resume Processed Successfully
                                </Typography>
                            </Box>
                            
                            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Match Score: {result.score}/100
                                </Typography>
                                
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Name: {result.parsed_data.name}
                                </Typography>
                                
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Email: {result.parsed_data.email}
                                </Typography>
                                
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Skills: {result.parsed_data.skills.join(', ')}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default JobResumeUpload; 