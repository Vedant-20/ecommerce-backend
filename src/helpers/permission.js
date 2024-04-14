import { User } from "../models/user.model";

const uploadProductPermission = async(userId) => {
    const user = await User.findById(userId)

    if(user.role === 'ADMIN'){
        return true
    }

    return false
}

export {uploadProductPermission}