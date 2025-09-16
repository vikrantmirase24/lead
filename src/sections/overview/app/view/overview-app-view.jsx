import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Unstable_Grid2';
import { Box, Card, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

export function OverviewAppView() {

  const [customerCount, setCustomerCount] = useState(0);
  const [profile, setProfile] = useState({ name: '' });
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    total: 0,
    active: 0,
    deactive: 0,
    today_followup: 0,
    today_lead: 0,
    month_lead: 0,
    today_draft_count: 0,
    total_draft_count: 0,
  });

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }
  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      return;
    }
    const decoded = parseJwt(token);
    const name = decoded?.name || decoded?.full_name || '';
    if (!name) {
      console.error('No name');
      return;
    }
    setProfile({ name });
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchLeadCounts = async () => {
      try {
        const { data } = await axios.get(endpoints.user.leadcount);
        if (mounted) {
          setCounts({
            total: data.total_enquiries_count || 0,
            active: data.total_active_count || 0,
            deactive: data.total_closed_count || 0,
            today_followup: data.today_followup_count || 0,
            today_lead: data.today_created_count || 0,
            month_lead: data.current_month_count || 0,
            today_draft_count: data.today_draft_count || 0,    
            total_draft_count: data.total_draft_count || 0,    
          });
        }
      } catch (error) {
        console.error('Error fetching lead counts:', error);
      }
    };
    fetchLeadCounts();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Welcome Back , {profile.name || 'User'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <Card sx={{ borderRadius: 2, p: 3, width: 1, }}>
            <Box sx={{ mb: 1.5, typography: 'subtitle2', opacity: 0.48 }}>Total Leads</Box>
            <Box sx={{ typography: 'h4' }}>{counts.total}</Box>
            <Box
              sx={{
                position: 'absolute', bottom: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: 2, cursor: 'pointer', transition: 'background 0.2s',
                '&:hover': { bgcolor: 'success.dark', }
              }}
              onClick={() => navigate(paths.dashboard.alleledslist)}
            >
              →
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card sx={{ borderRadius: 2, p: 3, width: 1 }}>
            <Box sx={{ mb: 1.5, typography: 'subtitle2', opacity: 0.48 }}>Active Leads</Box>
            <Box sx={{ typography: 'h4' }}>{counts.active}</Box>
            <Box
              sx={{
                position: 'absolute', bottom: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: 2, cursor: 'pointer', transition: 'background 0.2s',
                '&:hover': { bgcolor: 'success.dark', }
              }}
              onClick={() => navigate(paths.dashboard.activeledslist)}
            >
              →
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card sx={{ borderRadius: 2, p: 3, width: 1 }}>
            <Box sx={{ mb: 1.5, typography: 'subtitle2', opacity: 0.48 }}>Closed Leads</Box>
            <Box sx={{ typography: 'h4' }}>{counts.deactive}</Box>
            <Box
              sx={{
                position: 'absolute', bottom: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: 2, cursor: 'pointer', transition: 'background 0.2s',
                '&:hover': { bgcolor: 'success.dark', }
              }}
              onClick={() => navigate(paths.dashboard.closeledslist)}
            >
              →
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card sx={{ borderRadius: 2, p: 3, width: 1 }}>
            <Box sx={{ mb: 1.5, typography: 'subtitle2', opacity: 0.48 }}>Todays Followup Leads</Box>
            <Box sx={{ typography: 'h4' }}>{counts.today_followup}</Box>
            <Box
              sx={{
                position: 'absolute', bottom: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: 2, cursor: 'pointer', transition: 'background 0.2s',
                '&:hover': { bgcolor: 'success.dark', }
              }}
              onClick={() => navigate(paths.dashboard.todayfollowuplist)}
            >
              →
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card sx={{ borderRadius: 2, p: 3, width: 1 }}>
            <Box sx={{ mb: 1.5, typography: 'subtitle2', opacity: 0.48 }}>Todays Leads</Box>
            <Box sx={{ typography: 'h4' }}>{counts.today_lead}</Box>
            <Box
              sx={{
                position: 'absolute', bottom: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: 2, cursor: 'pointer', transition: 'background 0.2s',
                '&:hover': { bgcolor: 'success.dark', }
              }}
              onClick={() => navigate(paths.dashboard.todayledslist)}
            >
              →
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card sx={{ borderRadius: 2, p: 3, width: 1 }}>
            <Box sx={{ mb: 1.5, typography: 'subtitle2', opacity: 0.48 }}>Leads In Month</Box>
            <Box sx={{ typography: 'h4' }}>{counts.month_lead}</Box>
            <Box
              sx={{
                position: 'absolute', bottom: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: 2, cursor: 'pointer', transition: 'background 0.2s',
                '&:hover': { bgcolor: 'success.dark', }
              }}
              onClick={() => navigate(paths.dashboard.monthledslist)}
            >
              →
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card sx={{ borderRadius: 2, p: 3, width: 1 }}>
            <Box sx={{ mb: 1.5, typography: 'subtitle2', opacity: 0.48 }}>Incomplete Today Leads</Box>
            <Box sx={{ typography: 'h4' }}>{counts.today_draft_count}</Box>
            <Box
              sx={{
                position: 'absolute', bottom: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: 2, cursor: 'pointer', transition: 'background 0.2s',
                '&:hover': { bgcolor: 'success.dark', }
              }}
              onClick={() => navigate(paths.dashboard.incompleteTodayLead)}
            >
              →
            </Box>
          </Card>
        </Grid>
        <Grid xs={12} md={3}>
          <Card sx={{ borderRadius: 2, p: 3, width: 1 }}>
            <Box sx={{ mb: 1.5, typography: 'subtitle2', opacity: 0.48 }}>Incomplete All Leads</Box>
            <Box sx={{ typography: 'h4' }}>{counts.total_draft_count}</Box>
            <Box
              sx={{
                position: 'absolute', bottom: 16, right: 16, width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: 2, cursor: 'pointer', transition: 'background 0.2s',
                '&:hover': { bgcolor: 'success.dark', }
              }}
              onClick={() => navigate(paths.dashboard.incompleteAllLead)}
            >
              →
            </Box>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
