import json
import os.path
import shutil
from pathlib import Path
from typing import Dict, Optional, List, Any, Union


# source object must include: 'license', 'category' and 'file'
# additionally they may have: 'type', 'creator', 'name' and 'url'
#
# API:
#
# image object will include 'id', 'description' and 'file_url'
# it may also include 'name' and 'pools' (array)
#
# pool object will include 'name' and 'size'
# when pool object is part of an image object, it will also include 'index' and may include 'previd' and 'nextid' (post ids)
# otherwise it may include 'posts' (array) with some or all of pool's posts


image_types = {'photo': 'Photo', 'drawing': 'Drawing', 'picture': 'Picture', 'pic': 'Picture', 'image': 'Image'}


def get_image_type(old_pic_data: Dict[str, str]) -> str:
    return image_types.get(old_pic_data.get("type", "photo").lower(), None)


def convert_pic_data(old_pic_data: Dict[str, str]) -> Optional[Dict[str, Union[str, int]]]:
    image_type = get_image_type(old_pic_data)
    if image_type is None:
        return None
    description = f'{image_type} by {old_pic_data.get("creator", "unknown creator")} ' \
                  f'is licensed under {old_pic_data["license"]}'
    if 'url' in old_pic_data:
        description += f'\nsource: {old_pic_data["url"]}'
    result = {
        'description': description,
        'file_url': f'/images/{old_pic_data["category"]}/{old_pic_data["file"]}'
    }
    if 'name' in old_pic_data:
        result['name'] = old_pic_data['name']
    return result


def slugify_category_name(name: str) -> str:
    return name.lower().replace(' ', '-')

def assert_valid_filename(filename: str):
    if os.path.sep in filename:
        raise RuntimeError(f'{filename} contains a path separator')

def define_post_pool(pool_name: str, pic_list: List[Dict[str, Any]], current_pic_index: int) -> Dict[str, Any]:
    pool = {
        'name': pool_name,
        'size': len(pic_list),
        'index': current_pic_index
    }
    if current_pic_index > 0:
        pool['previd'] = pic_list[current_pic_index - 1]['id']
    if current_pic_index < len(pic_list) - 1:
        pool['nextid'] = pic_list[current_pic_index + 1]['id']
    return pool

def main():
    pics_data_path = Path('pics.json')
    api_path = Path('api')
    pools_path = Path(api_path, 'pool')
    images_path = Path(api_path, 'post')
    categories_path = Path(api_path, 'home')

    # ensure we have everything ready and load pics data
    if not api_path.is_dir():
        raise RuntimeError('API destination path is not found')
    with pics_data_path.open(mode='r', encoding='utf8') as f:
        pics_data = json.load(f)
    print(f'Loaded {len(pics_data)} images')

    # init vars
    categories: dict = {slugify_category_name(p['category']): None for p in pics_data}
    by_category: Dict[str, List[Dict[str, Any]]] = {c: [] for c in categories}
    all_pics: List[Dict[str, Any]] = []
    files: Dict[Path, Dict] = {}  # json data ready to be saved at given api path
    pic_id = 0

    for pic_data in pics_data:
        assert_valid_filename(pic_data['file'])
        assert_valid_filename(slugify_category_name(pic_data['category']))
        pic = convert_pic_data(pic_data)
        if pic is None:
            continue
        pic_id += 1
        pic['id'] = pic_id
        category_list = by_category[slugify_category_name(pic_data['category'])]
        category_list.append(pic)
        all_pics.append(pic)
    print(f'Processed {len(all_pics)} images')

    # create APIs
    category_previews: List[Dict[str, Any]] = []
    category_previews.append({
        'name': 'all',
        'size': len(all_pics),
        'posts': list(reversed(all_pics))[:3]
    })
    for category_name, pic_list in by_category.items():

        pool_api = {
            'name': category_name,
            'size': len(pic_list),
            'posts': pic_list
        }
        files[Path(pools_path, category_name)] = pool_api

        category_previews.append({
            'name': category_name,
            'size': len(pic_list),
            'posts': pic_list[:3]
        })

        for i, pic in enumerate(pic_list):
            p = pic.copy()
            category_pool = define_post_pool(pool_name=category_name, pic_list=pic_list, current_pic_index=i)
            all_pool = define_post_pool(pool_name='all', pic_list=all_pics, current_pic_index = p['id'] - 1)
            p['pools'] = [category_pool, all_pool]
            files[Path(images_path, str(p['id']))] = p
    
    all_pool_api = {
        'name': 'all',
        'size': len(all_pics),
        'posts': all_pics
    }
    files[Path(pools_path, 'all')] = all_pool_api
    files[categories_path] = {'pools': category_previews}

    # clear api directory and save new files to disk
    categories_path.unlink(missing_ok=True)
    for p in (pools_path, images_path):
        if p.is_dir():
            shutil.rmtree(p)
        p.mkdir(exist_ok=True)
    for path, data in files.items():
        with path.open(mode='w', encoding='utf8', newline='\n') as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
    print(f'Saved {len(files)} API files')


if __name__ == '__main__':
    main()
