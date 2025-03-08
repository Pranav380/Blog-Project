import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { blog } from "./models/dummy.js";

const app = express();
const port = 3000;
let conn = await mongoose.connect("mongodb://localhost:27017/blog");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(express.json());

const generateBlog = async () => {
	
};

app.get("/", (req,res) =>{
	res.render("index");
});

app.post("/submit-blog", async (req,res)=>{
	const blogContent = [];
	blogContent.push({
	title : req.body['title'],
	content : req.body['content']
	}) 
	try {
		await blog.insertMany(blogContent);
		console.log('Blog added sucessfully.');
	} catch (err){
		console.log('Error saving data.');
	}
	res.redirect("view");
	
});

app.get("/view", async (req,res)=>{
	console.log("fetching data from database.");
	const jsonData = await blog.find({})
	console.log("fetched data from database.");
	res.render('view', {data : jsonData});
});

app.get('/:title', async (req, res) => {
    try {
        const requestedTitle = req.params.title;

        const data = await blog.findOne({ title: requestedTitle });

        if (data) {
			res.render("blog",{name : data.title , body: data.content});
            //res.send(`<h1>${data.title}</h1><p>${data.content}</p>`);
        } else {
            res.status(404).send('Blog not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.delete("/delete/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const deletedBlog = await blog.findByIdAndDelete(blogId);

        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () =>{
	console.log(`Server running on ${port}`);
});