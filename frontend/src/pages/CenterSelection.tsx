import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useCenter } from '../contexts/CenterContext';
import { useAuth } from '../contexts/AuthContext';

export const CenterSelection: React.FC = () => {
  const navigate = useNavigate();
  const { centers, loadCenters, setSelectedCenter, loading: centersLoading } = useCenter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isAuthenticated) {
      loadCenters();
    }
  }, [isAuthenticated, authLoading, navigate, loadCenters]);

  const handleSelectCenter = (center: any) => {
    setSelectedCenter(center);
    navigate('/dashboard');
  };

  if (authLoading || centersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-warm-600">Loading centers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-h2 text-primary-600 mb-2">Select Your Center</h1>
          <p className="text-warm-600">Choose the center you want to work with</p>
        </div>

        {centers.length === 0 ? (
          <Card>
            <p className="text-center text-warm-500 py-8">
              No centers available for your city. Please contact administrator.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {centers.map((center) => (
              <Card
                key={center.id}
                hover
                className="cursor-pointer"
                onClick={() => handleSelectCenter(center)}
              >
                <h3 className="text-h3 text-warm-800 mb-2">{center.name}</h3>
                <p className="text-warm-500 mb-1">{center.location}</p>
                <p className="text-sm text-warm-400 mb-4">City: {center.city}</p>
                <Button variant="outline" className="w-full">
                  Select Center
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
