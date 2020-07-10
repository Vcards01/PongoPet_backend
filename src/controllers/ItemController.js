const Item = require ("../models/Item")
const User = require('../models/UserPetShop')

module.exports={
    async store(req,res){
        const {filename} = req.file;
        const {name}=req.body
        const{quantity}=req.body
        const {petshop_id}=req.headers;
        const {category}=req.body
        const{price}=req.body
        const{description}=req.body

        const user = await User.findById(petshop_id)

        if(!user){
            return res.status(400).json({erros:"Usuario não existe"})
        }

        const item = await Item.create({
            name:name,
            quantity:quantity,
            category:category,
            price:price,
            thumbnail:filename,
            petshop:petshop_id,
            description:description,
        })

        return res.json(item)
    },

    async index(req,res){
        let temp=[]
        let items
        let categories=req.body.activeCategory
        let search=req.body.activeSearch
        if (categories !== "Todas categorias")
        {
            items=await Item.find({"category":categories});
            if(search!=="")
            {
                items.forEach(item => {
                    console.log(item.name.toUpperCase().search(search.toUpperCase()))
                    if(item.name.toUpperCase().search(search.toUpperCase())!==-1)
                    {
                        temp.push(item)
                    }
                });
                items=temp
            // items=await Item.find({"$and":[{"category":categories},{ "$text" : { "$search" : search }}]});
            }
        }
        else{
            items=await Item.find();
            // if(search!=="")
            // {
            //     items=await Item.find({ "$text" : { "$search" : search }});
            // }
            if(search!=="")
            {
                items.forEach(item => {
                    console.log(item.name.toUpperCase().search(search.toUpperCase()))
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
            return res.status(400).json({erros:"Erro ao buscar os itens"})
        }
        return res.json(items)
    },

    async index_categories(req,res){
       let categories=await Item.distinct("category");
       if(!categories)
       {
            return res.status(400).json({erros:"Erro ao buscar categorias"})
       }
       return res.json(categories)
    }
}