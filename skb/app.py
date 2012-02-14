from pecan import make_app
from skb import model

def setup_app(config):
    
    model.init_model()
    
    return make_app(
        config.app.root,
        static_root     = config.app.static_root,
        debug           = config.app.debug,
        logging         = config.app.logging,
        template_path   = config.app.template_path,
        force_canonical = config.app.force_canonical
    )
