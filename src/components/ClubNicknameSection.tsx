import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useNicknameManagement } from '@/hooks/useNicknameManagement';

interface ClubNicknameSectionProps {
  personalId: string;
  onNicknameSet?: (nickname: string) => void;
}

const ClubNicknameSection: React.FC<ClubNicknameSectionProps> = ({
  personalId,
  onNicknameSet
}) => {
  const [nickname, setNickname] = useState('');
  const [currentNickname, setCurrentNickname] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { createOrUpdateNickname, updateNickname, getNickname, isLoading } = useNicknameManagement();

  // Load existing nickname when personalId changes
  useEffect(() => {
    if (personalId && personalId.length === 6) {
      loadNickname();
    }
  }, [personalId]);

  const loadNickname = async () => {
    const result = await getNickname(personalId);
    if (result.success && result.nickname) {
      setCurrentNickname(result.nickname);
      setNickname(result.nickname);
    } else {
      setCurrentNickname(null);
      setNickname('');
    }
  };

  const handleCreateNickname = async () => {
    const nicknameToUse = nickname.trim() || 'Friend';
    const result = await createOrUpdateNickname(personalId, nicknameToUse);
    
    if (result.success) {
      setCurrentNickname(result.nickname || nicknameToUse);
      setIsEditing(false);
      onNicknameSet?.(result.nickname || nicknameToUse);
      
      // Store in sessionStorage for other forms
      sessionStorage.setItem('tempPersonalId', personalId);
      sessionStorage.setItem('tempNickname', result.nickname || nicknameToUse);
    }
  };

  const handleUpdateNickname = async () => {
    if (!nickname.trim()) return;
    
    const result = await updateNickname(personalId, nickname.trim());
    
    if (result.success) {
      setCurrentNickname(result.nickname || nickname.trim());
      setIsEditing(false);
      onNicknameSet?.(result.nickname || nickname.trim());
      
      // Update sessionStorage
      sessionStorage.setItem('tempNickname', result.nickname || nickname.trim());
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setNickname(currentNickname || '');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNickname(currentNickname || '');
  };

  if (!personalId || personalId.length !== 6) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Secret Friend Name
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Choose a special name that only you will know. This helps keep your comments private and safe.
        </p>
      </div>

      {currentNickname && !isEditing ? (
        <div className="text-center space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Your Secret Friend Name:</p>
            <p className="text-xl font-bold text-green-700">{currentNickname}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="w-full"
            disabled={isLoading}
          >
            Change Friend Name
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <Label htmlFor="nickname" className="text-sm font-medium text-gray-700">
              Secret Friend Name (3-10 characters)
            </Label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your secret friend name..."
              maxLength={10}
              className="mt-1"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {nickname.length}/10 characters
            </p>
          </div>

          <div className="flex space-x-2">
            {currentNickname ? (
              <>
                <Button
                  onClick={handleUpdateNickname}
                  disabled={isLoading || !nickname.trim() || nickname.length < 3}
                  className="flex-1"
                >
                  {isLoading ? 'Updating...' : 'Update Name'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={handleCreateNickname}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Creating...' : 'Create Friend Name'}
              </Button>
            )}
          </div>

          {!currentNickname && (
            <p className="text-xs text-gray-500 text-center">
              Leave empty to use "Friend" as your secret name
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClubNicknameSection;