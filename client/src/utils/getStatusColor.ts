export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Applied': return 'text-blue-500';
    case 'Interview': return 'text-yellow-500';
    case 'Offered': return 'text-green-500';
    case 'Rejected': return 'text-red-500';
    default: return 'text-gray-500';
  }
};
