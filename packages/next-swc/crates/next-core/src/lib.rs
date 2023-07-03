#![feature(async_closure)]
#![feature(min_specialization)]
#![feature(box_syntax)]
#![feature(str_split_remainder)]

mod app_render;
mod app_segment_config;
mod app_source;
pub mod app_structure;
mod babel;
mod bootstrap;
mod embed_js;
pub mod env;
mod fallback;
pub mod manifest;
pub mod mode;
mod next_build;
pub mod next_client;
pub mod next_client_chunks;
mod next_client_component;
pub mod next_config;
mod next_edge;
mod next_font;
pub mod next_image;
mod next_import_map;
mod next_route_matcher;
pub mod next_server;
pub mod next_shared;
mod page_loader;
mod page_source;
pub mod pages_structure;
pub mod router;
pub mod router_source;
mod runtime;
mod sass;
mod transform_options;
pub mod url_node;
mod util;
mod web_entry_source;

pub use app_source::create_app_source;
pub use page_loader::create_page_loader_entry_asset;
pub use page_source::create_page_source;
pub use turbopack_binding::{turbopack::node::source_map, *};
pub use util::{pathname_for_path, PathType};
pub use web_entry_source::create_web_entry_source;

pub fn register() {
    turbo_tasks::register();
    turbo::tasks_bytes::register();
    turbo::tasks_fs::register();
    turbo::tasks_fetch::register();
    turbopack::dev::register();
    turbopack::dev_server::register();
    turbopack::node::register();
    turbopack::turbopack::register();
    turbopack::image::register();
    turbopack::ecmascript::register();
    turbopack::ecmascript_plugin::register();
    include!(concat!(env!("OUT_DIR"), "/register.rs"));
}
