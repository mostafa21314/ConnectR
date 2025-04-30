import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Box,
    Chip,
    Grid,
    Divider,
    CircularProgress,
} from '@mui/material';
import JobResumeUpload from '../components/JobResumeUpload';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/jobs/${id}/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }
                const data = await response.json();
                setJob(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Container>
        );
    }

    if (!job) {
        return (
            <Container>
                <Typography variant="h6">Job not found</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {job.title}
                </Typography>
                
                <Typography variant="h6" color="primary" gutterBottom>
                    {job.company}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                    <Chip label={job.location} sx={{ mr: 1 }} />
                    <Chip label={`${job.experience} years experience`} sx={{ mr: 1 }} />
                    <Chip label={job.salary} />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                    Description
                </Typography>
                <Typography paragraph>
                    {job.description}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Required Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {job.required_skills.map((skill, index) => (
                                <Chip key={index} label={skill} color="primary" />
                            ))}
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Preferred Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {job.preferred_skills.map((skill, index) => (
                                <Chip key={index} label={skill} variant="outlined" />
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Add the JobResumeUpload component */}
                <JobResumeUpload jobId={id} />
            </Paper>
        </Container>
    );
};

export default JobDetails; 