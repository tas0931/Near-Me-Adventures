const PlaceSuggestion = require('../models/PlaceSuggestion');
const User = require('../models/User');

exports.createSuggestion = async (req, res) => {
    try {
        console.log('📝 Creating place suggestion for user:', req.userId);
        const { placeName, city, stateProvince, country, category, description } = req.body;
        const userId = req.userId;

        // Validation
        if (!placeName || !city || !country || !category || !description) {
            return res.status(400).json({ message: 'Place name, city, country, category, and description are required' });
        }

        // Get user info
        const user = await User.findById(userId).select('name email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const suggestion = new PlaceSuggestion({
            userId,
            placeName: placeName.trim(),
            city: city.trim(),
            stateProvince: stateProvince ? stateProvince.trim() : undefined,
            country: country.trim(),
            category,
            description: description.trim(),
            userName: user.name,
            userEmail: user.email
        });

        await suggestion.save();

        // Populate user data
        await suggestion.populate('userId', 'name email');

        console.log('✅ Place suggestion created:', suggestion._id);
        res.status(201).json({ message: 'Place suggestion submitted successfully', suggestion });
    } catch (error) {
        console.error('❌ createSuggestion error:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: error.message || 'Failed to create place suggestion' });
    }
};

exports.getAllSuggestions = async (req, res) => {
    try {
        console.log('📝 Fetching all place suggestions...');
        const suggestions = await PlaceSuggestion.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        console.log(`✅ Found ${suggestions.length} place suggestions`);
        res.json({ suggestions });
    } catch (error) {
        console.error('❌ getAllSuggestions error:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: error.message || 'Failed to fetch place suggestions' });
    }
};

exports.getUserSuggestions = async (req, res) => {
    try {
        const userId = req.userId;
        const suggestions = await PlaceSuggestion.find({ userId })
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ suggestions });
    } catch (error) {
        console.error('getUserSuggestions error:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: error.message || 'Failed to fetch user suggestions' });
    }
};

exports.deleteSuggestion = async (req, res) => {
    try {
        const { suggestionId } = req.params;
        const userId = req.userId;

        console.log('🗑️  Delete suggestion request:');
        console.log('   Suggestion ID:', suggestionId);
        console.log('   User ID:', userId);
        console.log('   Is Admin Token:', req.isAdminToken);

        const suggestion = await PlaceSuggestion.findById(suggestionId);
        if (!suggestion) {
            return res.status(404).json({ message: 'Place suggestion not found' });
        }

        console.log('   Suggestion Owner ID:', suggestion.userId?.toString());

        // Allow deletion if the request is from the suggestion owner or an admin token
        if (!req.isAdminToken && (!userId || suggestion.userId.toString() !== userId)) {
            console.log('❌ Authorization failed - Not admin and not owner');
            return res.status(403).json({ message: 'Not authorized to delete this suggestion' });
        }

        console.log('✅ Authorization passed - Deleting suggestion');
        await PlaceSuggestion.findByIdAndDelete(suggestionId);
        res.json({ message: 'Place suggestion deleted successfully' });
    } catch (error) {
        console.error('deleteSuggestion error:', error && error.stack ? error.stack : error);
        res.status(500).json({ message: error.message || 'Failed to delete suggestion' });
    }
};
