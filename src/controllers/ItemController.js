const Item = require ("../models/Item")
const User = require('../models/PetShop');

module.exports={

    async store(req,res){

        const {filename} = req.file;
        const {name}=req.body
        const{quantity}=req.body
        const {petshop_id}=req.headers;
        const {petshop_name}=req.headers;
        const {category}=req.body
        const{price}=req.body
        const{description}=req.body

        const user = await User.findById(petshop_id)

        if(!user){
            return res.json(({"error":'Usuario não existe',"status":"400"}))
        }
        const item = await Item.create({
            name:name,
            quantity:quantity,
            category:category,
            price:price,
            thumbnail:filename,
            petshop:petshop_id,
            petshop_name:petshop_name,
            description:description,
        })

        return res.json(item)
    },

    async update(req,res){
        const {name}=req.body
        const {category}=req.body
        const{price}=req.body
        const{description}=req.body
        const{id}=req.body
        if(!req.file)
        {
            await Item.updateOne({_id:id},{$set: {name:name,category:category,price:price,description:description}});
        }
        else{
            const filename = req.file.filename;
            await Item.updateOne({_id:id},{$set: {name:name,category:category,price:price,thumbnail:filename,description:description}});
        }
        return res.json({"ok":true})
    },

    async index(req,res){
        let temp=[]
        let items=[]
        let categories=req.body.activeCategory
        let search=req.body.activeSearch
        if (categories !== "Todas categorias")
        {
            items=await Item.find({"category":categories});
            if(search!=="")
            {
                items.forEach(item => {
                    if(item.name.toUpperCase().search(search.toUpperCase())!==-1)
                    {
                        temp.push(item)
                    }
                });
                items=temp
            }
        }
        else{
            items=await Item.find();
            if(search!=="")
            {
                items.forEach(item => {
                    if(item.name.toUpperCase().search(search.toUpperCase())!==-1)
                    {
                        temp.push(item)
                    }
                });
                items=temp
            }
        }
        if(!items)
        {
            return res.json(({"error":'Erro na busca',"status":"400"}))
        }
        return res.json(items)
    },

    async destroy(req,res){
        const{id}=req.body
        await Item.deleteOne({_id:id})
        return res.json({"ok":true})
    },

    async index_categories(req,res){
       let categories=await Item.distinct("category");
       if(!categories)
       {
        return res.json(({"error":'Erro na consulta',"status":"400"}))
       }
       return res.json(categories)
    },
}