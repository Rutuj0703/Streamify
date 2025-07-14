import { CheckCircleIcon, MapPinIcon, UserCheckIcon, UserPlusIcon } from "lucide-react";
import { acceptFriendRequest, getFriendRequests, getOutgoingFriendReqs, sendFriendRequest } from "../lib/api"
import { getLanguageFlag } from "./FriendCard";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { capitialize } from "../lib/utils"

const RecommendedUsers = ({user}) => {
    const queryClient = useQueryClient();
    const [outgoingRequestsIds,setOutgoingRequestsIds] =useState(new Set());

    const {data:outgoingFriendReqs=[]} = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs
  });

  const {mutate:sendRequestMutation,isPending:isPendingSendRequest} = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: ()=> queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  })

    useEffect(()=>{
    const outgoingIds = new Set()
    if(outgoingFriendReqs && outgoingFriendReqs.length>0){
      outgoingFriendReqs.forEach((req)=>{
        outgoingIds.add(req.recipient._id)
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  },[outgoingFriendReqs])

    const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

    //----

  
    const { data:friendRequests,isLoading } = useQuery({
      queryKey: ["friendRequests"],
      queryFn: getFriendRequests,
    });
  
    const {mutate:acceptRequestMutation,isPending:isPendingAcceptRequest} = useMutation({
      mutationFn: acceptFriendRequest,
      onSuccess: ()=> {
        queryClient.invalidateQueries({ queryKey:["friendRequests"] });
        queryClient.invalidateQueries({ queryKey:["friends"] });
        queryClient.invalidateQueries({ queryKey:["users"] });
      },
    });
  
    const incomingRequests=friendRequests?.incomingReqs || [];
    

  return (
    <div key={user._id} className="card bg-base-200 hover:shadow-lg transition-all duration-300">
        <div className="card-body p-5 space-y-4">
            <div className="flex items-center gap-3">
                <div className="avatar size-16 rounded-full">
                    <img src={user.profilePic} alt={user.fullName} />
                </div>

                <div>
                    <h3 className="font-semibold text-lg">{user.fullName}</h3>
                    {user.location && (
                        <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {user.location}
                        </div>
                    )}
                </div>
            </div>
            {/* Languages with flags */}
                <div className="flex flex-wrap gap-1.5">
                    <span className="badge badge-secondary">
                        {getLanguageFlag(user.nativeLanguage)}
                        Native: {capitialize(user.nativeLanguage)}
                    </span>
                    <span className="badge badge-outline">
                        {getLanguageFlag(user.learningLanguage)}
                        Learning: {capitialize(user.learningLanguage)}
                    </span>
                </div>
                {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}
                {/* Action button */}
                <button
                className={`btn w-full mt-2 ${
                    incomingRequests.some((request) => request.sender.email === user.email) ? "btn-warning" : 
                    hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                } `}
                onClick={() => {
                  const existingRequest = incomingRequests.find((request) => request.sender.email === user.email) 
                  if(existingRequest){
                    acceptRequestMutation(existingRequest._id)
                  }
                  else{
                    sendRequestMutation(user._id)
                  }}}
                disabled={hasRequestBeenSent || isPendingSendRequest || isPendingAcceptRequest}
                >
                {incomingRequests.some((request) => request.sender.email === user.email) ? (
                      <>
                      <UserCheckIcon className="size-4 mr-2" />
                        Accept Friend Request
                      </>
                      ):(hasRequestBeenSent ? (
                          <>
                          <CheckCircleIcon className="size-4 mr-2" />
                          Request Sent
                          </>
                        ) : (
                          <>
                          <UserPlusIcon className="size-4 mr-2" />
                          Send Friend Request
                          </>
                        )
                      )
                  
                }
                </button>
        </div>
    </div>
  )
}

export default RecommendedUsers;

