import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req,res) {
    try {
        const currentUserId = req.user.id;
        const currentUser= req.user;

        const recommendedUsers = await User.find({
            $and:[
                {_id: {$ne:currentUserId}}, //exclude self
                {_id: {$nin:currentUser.friends}}, //exclude friends
                {isOnboarded:true},
            ],
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller: ",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getMyFriends(req,res) {
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller: ",error);
        res.status(500).json({ message: "Internal Server Error "});
    }
}

export async function sendFriendRequest(req,res){
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params

        if(myId === recipientId){
            return res.status(400).json({ message:" You cannot send friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({ message:" Recipient not found" });
        }
        //if already friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({ message:" You are already friends with this user" });
        }

        //if friend request already sent
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient:recipientId},
                {sender:recipientId, recipient: myId},
            ],
        });
        if(existingRequest){
            //***this error is popping***
            return res.status(400).json({ message:" A friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        });

        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error in sendFriendRequest controller: ",error.message);
        return res.status(500).json({ message:"Internal Server Error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id:requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({message:"Friend request not found"});
        }
        //verifying if the current user is the recipient
        if(friendRequest.recipient.toString()!==req.user.id){
            return res.status(403).json({message:"You are not authorized to accept this friend request"});
        }
        friendRequest.status="accepted"; //this is working
        await friendRequest.save();

        //adding each user to other's friend array
        await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
        $addToSet: { friends: friendRequest.sender },
        });
        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.error("Error in acceptFriendRequest controller: ",error.message);
        return res.status(500).json({ message:"Internal Server Error" });
    }
}

export async function getFriendRequest(req,res){
    try {
        const incomingReqs= await FriendRequest.find({
            recipient:req.user.id,
            status:"pending"
        }).populate("sender","fullName email profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status:"accepted",
        }).populate("recipient"," fullName profilePic");

        res.status(200).json({incomingReqs,acceptedReqs});
    } catch (error) {
        console.error("Error in getFriendRequest controller: ",error.message);
        return res.status(500).json({ message:"Internal Server Error" });
    }
}

export async function getOutgoingFriendRequest(req,res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error("Error in getOutgoingFriendRequest controller: ",error.message);
        return res.status(500).json({ message:"Internal Server Error" });
    }
}