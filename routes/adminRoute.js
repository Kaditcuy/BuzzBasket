import express from 'express';
import AdminControllers from '../controllers/AdminController';

const router = express.Router();

//Middleware function to check if the user has admin privileges
function isAdmin(req, res, next) {
        if (req.user && req.user.isAdmin) {
                //User has admin privileges, allow access to the next middleware
                next()
        } else {
                //User does not have admin privileges, deny access
                res.status(403).json({error: 'Permission denied'});
        }
}

/* ------------------User with admin priveleges routes---------------------------- */
//Retrieve list of all users
router.get('/api/admin/users', isAdmin, async (req, res) => {
        try {
                const users = await User.find();
                res.json(users);
        } catch (error) {
                console.error(error);
                res.status(500).json({error: 'Internal Server Error'});
        }
});

// Retrieve details of a specific user
router.get('/api/admin/users/:userId', isAdmin, AdminControllers.getuser);

// Update a users details
router.put('/api/admin/users/:userId', isAdmin, AdminControllers.putuser);

// Delete a users account
router.delete('/api/admin/users/:userId', isAdmin, AdminControllers.deleteuser);

// Search for users based on specific criteria
router.get('/api/admin/users/search', isAdmin, AdminControllers.searchuser);

