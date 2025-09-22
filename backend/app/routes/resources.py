from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Resource, ResourceCategory
from ..schemas import (
    ResourceCreate, ResourceResponse, ResourceUpdate,
    ResourceCategoryCreate, ResourceCategoryResponse
)
from ..security import get_current_user

router = APIRouter(prefix="/resources", tags=["resources"])

# Resource Categories
@router.post("/categories/", response_model=ResourceCategoryResponse, summary="Create resource category", description="Create a new resource category.")
def create_resource_category(
    category: ResourceCategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # TODO: Add admin check
    new_category = ResourceCategory(category_name=category.category_name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/categories/", response_model=list[ResourceCategoryResponse], summary="Get all resource categories", description="Retrieve all resource categories.")
def get_resource_categories(db: Session = Depends(get_db)):
    categories = db.query(ResourceCategory).all()
    return categories

# Resources
@router.post("/", response_model=ResourceResponse, summary="Create resource", description="Create a new resource.")
def create_resource(
    resource: ResourceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify category exists
    category = db.query(ResourceCategory).filter(ResourceCategory.category_id == resource.category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Resource category not found")

    new_resource = Resource(
        category_id=resource.category_id,
        uploaded_by_id=current_user.user_id,
        title=resource.title,
        description=resource.description,
        url=resource.url
    )
    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)
    return new_resource

@router.get("/", response_model=list[ResourceResponse], summary="Get all resources", description="Retrieve all resources.")
def get_resources(
    skip: int = 0,
    limit: int = 100,
    category_id: int = None,
    db: Session = Depends(get_db)
):
    query = db.query(Resource)
    if category_id:
        query = query.filter(Resource.category_id == category_id)
    resources = query.offset(skip).limit(limit).all()
    return resources

@router.get("/{resource_id}", response_model=ResourceResponse, summary="Get resource by ID", description="Retrieve a specific resource by its ID.")
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = db.query(Resource).filter(Resource.resource_id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource

@router.put("/{resource_id}", response_model=ResourceResponse, summary="Update resource", description="Update a resource's information.")
def update_resource(
    resource_id: int,
    resource_update: ResourceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resource = db.query(Resource).filter(Resource.resource_id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    if resource.uploaded_by_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this resource")

    update_data = resource_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(resource, field, value)
    db.commit()
    db.refresh(resource)
    return resource

@router.delete("/{resource_id}", summary="Delete resource", description="Delete a resource.")
def delete_resource(
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resource = db.query(Resource).filter(Resource.resource_id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    if resource.uploaded_by_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this resource")

    db.delete(resource)
    db.commit()
    return {"message": "Resource deleted successfully"}