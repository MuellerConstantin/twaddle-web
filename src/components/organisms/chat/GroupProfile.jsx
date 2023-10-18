import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserPlus} from '@fortawesome/free-solid-svg-icons';
import GroupChatAvatar from './GroupChatAvatar';
import GroupMemberEntry from '../../molecules/chat/GroupMemberEntry';
import AddGroupMemberForm from './AddGroupMemberForm';
import UpdateGroupChatAvatarMenu from './UpdateGroupChatAvatarMenu';

/**
 * Visualizes a group profile.
 *
 * @return {JSX.Element} The group profile component
 */
export default function GroupProfile({group, onChange}) {
  const principal = useSelector((state) => state.auth.principal);

  const [showAddMember, setShowAddMember] = useState(false);

  return (
    <div className="space-y-6">
      <div
        className={`flex flex-col items-center ${
          group.participants.find((participant) => participant.id === principal.id)?.isAdmin ? 'space-y-6' : 'space-y-2'
        }`}
      >
        <div className="bg-slate-200 text-slate-800 border border-slate-400 w-fit rounded-full relative">
          <div className="h-32 w-32 rounded-full overflow-hidden">
            <GroupChatAvatar chatId={group.id} />
          </div>
          {group.participants.find((participant) => participant.id === principal.id)?.isAdmin && (
            <div className="absolute -bottom-4 mx-auto left-0 right-0 w-16">
              <UpdateGroupChatAvatarMenu chatId={group.id} onChange={onChange} />
            </div>
          )}
        </div>
        <div className="text-center overflow-hidden">
          <div className="text-lg font-semibold text-gray-800 truncate">{group.name}</div>
        </div>
      </div>
      <hr className="border-b border-slate-300" />
      <div className="space-y-2">
        <div className="px-2 text-sm">{group.participants.length} Member(s)</div>
        <ul className="space-y-2">
          {group.participants.find((participant) => participant.id === principal.id)?.isAdmin && showAddMember ? (
            <div className="p-2">
              <AddGroupMemberForm
                group={group}
                onNewMember={() => {
                  onChange();
                  setShowAddMember(false);
                }}
              />
            </div>
          ) : (
            <div className="rounded p-2 hover:bg-slate-200 hover:cursor-pointer" onClick={() => setShowAddMember(true)}>
              <div className="flex space-x-4 items-center overflow-hidden space-x-2">
                <div className="bg-slate-200 text-slate-800 border border-slate-400 p-1 w-fit rounded-full">
                  <div className="h-8 w-8 rounded-full overflow-hidden flex justify-center items-center">
                    <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5" />
                  </div>
                </div>
                <div className="space-y-1 overflow-hidden">
                  <span className="block truncate font-semibold">Add Member</span>
                </div>
              </div>
            </div>
          )}
          {group.participants
            .filter((participant) => participant.id === principal.id)
            .map((participant) => (
              <li key={participant.id}>
                <GroupMemberEntry user={participant} />
              </li>
            ))}
          {group.participants
            .filter((participant) => participant.id !== principal.id)
            .map((participant) => (
              <li key={participant.id}>
                <GroupMemberEntry user={participant} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

GroupProfile.propTypes = {
  group: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
