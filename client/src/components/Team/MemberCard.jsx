import { Card, CardContent, Box, Typography, Avatar, IconButton, Chip } from '@mui/material';
import { PersonRemove } from '@mui/icons-material';

export default function MemberCard({ member, isAdmin, canRemove, onRemove }) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
      <Avatar sx={{ bgcolor: member.color, width: 48, height: 48, mr: 2, ml: 1 }}>
        {member.displayName?.[0]?.toUpperCase()}
      </Avatar>
      <CardContent sx={{ flex: 1, py: 1, '&:last-child': { pb: 1 } }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            {member.displayName}
          </Typography>
          {member.role === 'admin' && (
            <Chip label="Admin" size="small" color="primary" sx={{ height: 20, fontSize: 11 }} />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {member.email}
        </Typography>
      </CardContent>
      {canRemove && (
        <IconButton color="error" onClick={() => onRemove(member.id)} title="Remove member">
          <PersonRemove />
        </IconButton>
      )}
    </Card>
  );
}
