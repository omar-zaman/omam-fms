const Material = require("../models/Material");

exports.getAllMaterials = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ],
      };
    }

    const materials = await Material.find(query).populate("supplierId", "name").sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    next(error);
  }
};

exports.getMaterialById = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id).populate("supplierId");
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json(material);
  } catch (error) {
    next(error);
  }
};

exports.createMaterial = async (req, res, next) => {
  try {
    const material = new Material(req.body);
    await material.save();
    await material.populate("supplierId", "name");
    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
};

exports.updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("supplierId", "name");
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json(material);
  } catch (error) {
    next(error);
  }
};

exports.deleteMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    next(error);
  }
};

