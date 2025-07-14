import { useQuery } from "@tanstack/react-query";
import { getRecommendedUsers, getUserFriends } from "../lib/api";
import { Link } from "react-router";
import { UsersIcon } from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import RecommendedUsers from "../components/RecommendedUsers";

const HomePage = () => {

  const {data:friends=[],isLoading:loadingFriends} = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends
  })

  const {data:recommendedUsers=[],isLoading:loadingUsers} = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers
  })

  return (
    <div className="pt-20 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4 sm:mt-14">
  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
    Your Friends
  </h2>

  <div className="sm:ml-auto">
    <Link
      to="/notifications"
      className="btn btn-outline btn-sm w-full sm:w-auto text-center"
    >
      <UsersIcon className="mr-2 size-4" />
      Friend Requests
    </Link>
  </div>
</div>

        {loadingFriends? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {friends.map((friend)=>(
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
          ): (recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {recommendedUsers.map((user)=>(
              <RecommendedUsers key={user._id} user={user} />
            ))}
          </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default HomePage