from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Hệ thống Quản lý Người dùng")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class user(BaseModel):
    id: Optional[int] = None
    ho_ten: str
    email: str
    vai_tro: str  

users: List[user] = [
    user(id=1, ho_ten="Nguyen A", email="nguyenA@gmail.com", vai_tro="Admin"),
    user(id=2, ho_ten="Tran B", email="tranB@gmail.com", vai_tro="User")
]

bo_dem_id = 2

@app.get("/api/users", response_model=List[user])
def get_user():
    return users

@app.post("/api/users", response_model=user)
def add_user(new_user: user):
    global bo_dem_id
    bo_dem_id += 1
    new_user.id = bo_dem_id
    users.append(new_user)
    return new_user

@app.put("/api/users/{id_can_sua}", response_model=user)
def update_user(id_can_sua: int, updated_user: user):
    for vi_tri, nd in enumerate(users):
        if nd.id == id_can_sua:
            updated_user.id = id_can_sua
            users[vi_tri] = updated_user
            return updated_user

@app.delete("/api/users/{id_can_xoa}")
def delete_user(id_can_xoa: int):
    for vi_tri, nd in enumerate(users):
        if nd.id == id_can_xoa:
            users.pop(vi_tri)
            return id_can_xoa 